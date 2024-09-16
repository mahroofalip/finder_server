import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  place: string | null;
  displayName: string | null;
  profession: string | null;
  eyeColor: string | null;
  hairColor: string | null;
  education: string | null;
  gender: string | null;
  maritalStatus: string | null;
  description: string | null;
  isOnline: boolean;
  profileImage: string | null;
  profileImageKey: string | null;
  userName: string | null;
  birthDate: string | null;
  lastActiveAt: Date | null;
  height: string | null;
  weight: string | null;
  interests: string | null;
  lookingFor: string | null;
  isProfileCompleted: boolean; // Added field
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public phone!: string;
  public firstName!: string;
  public lastName!: string;
  public profession!: string;
  public eyeColor!: string;
  public hairColor!: string;
  public education!: string;
  public gender!: string;
  public displayName!: string;
  public description!: string;
  public place!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public lastActiveAt!: Date;
  public maritalStatus!: string | null;
  public isOnline!: boolean;
  public profileImage!: string | null;
  public profileImageKey!: string | null;
  public interests!: string | null;
  public lookingFor!: string | null;
  public userName!: string | null;
  public birthDate!: string | null;
  public height!: string | null;
  public weight!: string | null;
  public isProfileCompleted!: boolean; // Added field

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    place: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    interests: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    lookingFor: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    eyeColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hairColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    education: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    lastActiveAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    profileImageKey: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    birthDate: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    isProfileCompleted: { // Added field
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: `${process.env.START_APP_NAME}USERS`,
  }
);

export default User;
