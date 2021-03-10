import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../dto/user.dto';
import { ENTITY } from '../enums/entity.enum';

const checkProps = (props: string[], dataKeys: string[]) => {
  for (const key of dataKeys) {
    if (!props.includes(key)) {
      throw new BadRequestException(`The property \\ ${key} \\ is not valid`);
    }
  }
};

const checkUsersProps = (data: Partial<User>): Partial<User> => {
  const props = [
    'name',
    'email',
    'role',
    'image',
    'status',
    'preferences',
    'serviceZone',
    'newFavorite',
    'removeFavorite',
    'notificationTokens',
  ];
  const { role } = data;
  if (role && !['ADMIN', 'JUN', 'CUN'].includes(role))
    throw new BadRequestException('\\ role \\ must be ADMIN, JUN or CUN ');

  checkProps(props, Object.keys(data));
  return data;
};

export const acceptedProps = (route: string, data: any): any => {
  if (route === ENTITY.USERS) return checkUsersProps(data);

  throw new InternalServerErrorException('Invalid Route');
};
