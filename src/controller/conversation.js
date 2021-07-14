import * as conversationService from '../services/conversation.service.js';

export const createConversation = async (req, res) => {
    try{
        let data = await conversationService.createConversation(req);
        if (data.error) {
            return res.status(data.status).send(data.reason);
        }
        return res.status(200).send(data);
    } catch(e) {
        return res.status(500).send(e.message);
    }  
}
