import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseService } from 'src/services/firebase.service';
import { Image } from '../../dto/image.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { User } from '../../dto/user.dto';
import { ENTITY } from '../../enums/entity.enum';
import { ImageRepository } from '../image/image.repository';

@Injectable()
export class UserRepository {
  readonly type = ENTITY.USERS;

  constructor(
    @InjectModel('User') private userDb: Model<User>,
    private imageRepository: ImageRepository,
  ) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, users] = await Promise.all([
        this.userDb.countDocuments(filter),
        this.userDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: users };
    } catch (e) {
      throw new InternalServerErrorException('Filter users Database error', e);
    }
  }

  async getOne(id: string): Promise<User> {
    try {
      const document = await this.userDb.findOne({ _id: id }).populate([
        {
          path: 'image',
          match: { status: true },
          select: { url: true },
        },
      ]);

      if (!document)
        throw new NotFoundException(`Could not find user for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else throw new InternalServerErrorException('findUser Database error', e);
    }
  }

  async getAuthUser(user: User): Promise<User> {
    try {
      const document = await this.userDb
        .findOne({ firebaseId: user.firebaseId })
        .populate([
          {
            path: 'image',
            match: { status: true },
            select: { url: true },
          },
        ]);

      if (!document)
        throw new NotFoundException(
          `Could not find user for id: ${user.firebaseId}`,
        );

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else throw new InternalServerErrorException('findUser Database error', e);
    }
  }

  async update(id: string, data: Partial<User>, image: any): Promise<boolean> {
    try {
      const { newFavorite, removeFavorite, notificationTokens, ...rest } = data;

      if (notificationTokens) {
        const userDB = await this.userDb.findOne({ _id: id });
        const NT: any = userDB.notificationTokens;
        if (!NT.includes(notificationTokens)) {
          NT.push(notificationTokens);
        }

        await this.userDb.findOneAndUpdate(
          { _id: id },
          { notificationTokens: NT },
        );
      }
      if (newFavorite) {
        await this.userDb.findOneAndUpdate(
          { _id: id },
          { $addToSet: { favoriteOwners: newFavorite } },
        );
      }
      if (removeFavorite) {
        await this.userDb.findOneAndUpdate(
          { _id: id },
          { $pull: { favoriteUnits: removeFavorite } },
        );
      }
      let newImage = {};
      if (image) {
        await this.imageRepository.deleteImagesByTypeAndId(this.type, id);

        image.parentType = this.type;
        image.parentId = id;
        const imageModel = await this.imageRepository.insertImages([image]);
        newImage = { image: imageModel[0]._id };
      }
      const document = await this.userDb
        .findOneAndUpdate({ _id: id }, { ...rest, ...newImage }, { new: true })
        .select({
          name: true,
          email: true,
          image: true,
          preferences: true,
          role: true,
          favoriteOwners: true,
          firebaseId: true,
        })
        .populate([
          {
            path: 'image',
            match: { status: true },
            select: { url: true, blurHash: true },
          },
        ]);
      const { role } = data;
      if (role) {
        const { firebaseId, _id } = document;
        const claims = { role, mongoId: _id };
        FirebaseService.setClaims(firebaseId, claims);
      }

      if (!document)
        throw new NotFoundException(
          `Could not find user to update for id: ${id}`,
        );

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('updateUser Database error', e);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.userDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find user to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('deleteUser Database error', e);
    }
  }
}
