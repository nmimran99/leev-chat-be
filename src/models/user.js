import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant'},
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true,
        min: 8
    },
    firstName: String,
    lastName: String,
    phoneNumber: String,
    birthDate: Date,
    employedBy: String,
    createdBy: String,
    avatar: String,
    isActive: { type: Boolean, default: true },
    data: Object,
    role: { type: Schema.Types.ObjectId, ref: 'Role'},
    lang: String,
    isAdmin: { type: Boolean, default: false }
}, {
    timestamps: true
});


export default mongoose.model('User', userSchema);