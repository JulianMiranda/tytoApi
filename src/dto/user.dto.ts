import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsMongoId,
	IsString,
	IsUrl,
} from 'class-validator';
import {Document} from 'mongoose';

export class User extends Document {
	@IsString()
	firebaseId: string;

	@IsBoolean()
	online: boolean;

	@IsString()
	name: string;

	@IsString()
	@IsEmail()
	email: string;

	@IsString()
	@IsUrl()
	image: string;

	@IsString()
	serviceZone: string;

	@IsString()
	role: string;

	@IsArray()
	permissions: string[];

	@IsString()
	defaultImage: string;

	@IsString()
	newFavorite: string;

	@IsString()
	removeFavorite: string;

	@IsArray()
	notificationTokens: string[];
}
