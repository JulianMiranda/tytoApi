import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/dto/user.dto';
import { ENTITY } from '../enums/entity.enum';

const prepareProps = (props: string[], data: any) => {
  for (const key of Object.keys(data)) {
    if (!props.includes(key)) delete data[key];
  }

  return data;
};

const checkNullOrUndefined = (props: string[], data: any) => {
  for (const key of props) {
    if (!data.hasOwnProperty(key))
      throw new BadRequestException(`The property \\ ${key} \\ is required`);
    else if (data[key] == null)
      throw new BadRequestException(
        `The property \\ ${key} \\ cannot be null or undefined`,
      );
    else if (data[key] === '')
      throw new BadRequestException(
        `The property \\ ${key} \\ cannot be a empty string`,
      );
    else if (data[key] === [])
      throw new BadRequestException(
        `The property \\ ${key} \\ cannot be a empty array`,
      );
  }
};

const checkUsersProps = (data: Partial<User>): Partial<User> => {
  const props = ['name', 'image'];
  const dataCopy = prepareProps(props, { ...data });
  checkNullOrUndefined(props, dataCopy);
  return data;
};

export const requiredProps = (route: string, data: any): any => {
  if (route === ENTITY.USERS) return checkUsersProps(data);

  throw new InternalServerErrorException('Invalid Route');
};
