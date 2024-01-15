import mongoose, { Document, Schema } from "mongoose";
import { v4 } from "uuid";


export interface UserDoc extends Document {
    uid: string;
    fullname: string;
    username: string;
    password: string;
    createdAt: Date;
}

const userSchema = new Schema<UserDoc>({
    uid: { type: String, required: true, unique: true, default: v4 },
    fullname: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<UserDoc>("User", userSchema);