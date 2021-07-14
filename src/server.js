import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import 'dotenv/config.js';
import cors from 'cors';
import { createMessage } from './services/message.service.js';
import conversationRoute from './routes/conversation.js'
import { getUserConversations } from './services/conversation.service.js';
import Message from './models/message.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);
const io = new Server(server, { 
    cors: {
        origin: '*'
    }
});

mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.axy2i.mongodb.net/${process.env.DB_NAME || 'leevdb'}?retryWrites=true&w=majority`,
	{ useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false }
);

io.sockets.on('connection', async socket => {
    const userId = socket.handshake.query.id
    const convos = await getUserConversations(userId);
    convos.forEach(c => socket.join(`${c._id}`))
    socket.emit('userConversations', convos)

    socket.on('send-message', async message => {
        const msg = await createMessage(message);
        io.to(`${msg.conversation}`).emit('receive-message', msg);
        
    })

    socket.on('read-messages', async ({ conversationId, sender }) => {
        try {
            const msgs = await Message.updateMany({ conversation: conversationId, read: false, from: sender}, { read: true }, { new: true});
            io.to(`${conversationId}`).emit('messages-read', `${conversationId}`);
        } catch (e){ 
            console.log(e.message);
            io.to(`${conversationId}`).emit('messages-read', null);
        }
    })

    socket.on('create-conversation', ({ conversationId }) => {
        socket.join(conversationId)
    }) 
})

app.use('/conversation', conversationRoute);



server.listen(8000, () => {
    console.log('listening on port 8000')
})
