import * as mongoose from 'mongoose';
import {schemaOptions} from '../utils/index';

export const UserSchema = new mongoose.Schema(
	{
		firebaseId: String,
		name: {type: String, index: true},
		email: {
			type: String,
			index: true,
			unique: [true, 'El email ya existe'],
		},
		role: String,
		defaultImage: String,
		image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'},
		status: {type: Boolean, default: true, index: true},
		preferences: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
		favoriteOwners: [
			{type: mongoose.Schema.Types.ObjectId, ref: 'Owners', index: true},
		],
		notificationTokens: [{type: String}],
		online: {type: Boolean, default: false, index: true},
		serviceZone: String,
	},
	{...schemaOptions},
);
