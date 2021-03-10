import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
	private static readonly logger = new Logger(FirebaseService.name);
	static init() {
		admin.initializeApp({
			credential: admin.credential.applicationDefault(),
		});
	}

	static get getAdmin(): any {
		return admin;
	}

	static setClaims(id: string, claims: object) {
		admin
			.auth()
			.setCustomUserClaims(id, {...claims})
			.then(() => console.log('Successful firebase claims update'))
			.catch((e) => {
				throw new InternalServerErrorException(
					'Error in firebase claims update',
					e,
				);
			});
	}
	static deleteUser(id: string) {
		admin.auth().deleteUser(id);
		this.logger.log(`Delete from Firebase user ${id}`);
	}
}
