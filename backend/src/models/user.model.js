import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';

/**
 * Usuario del sistema. La contraseña se almacena hasheada con bcrypt.
 */
export class User extends Model {
  /** Compara una contraseña en texto plano contra el hash almacenado. */
  async verifyPassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.passwordHash);
  }

  /** Representación segura del usuario (sin el hash de la contraseña). */
  toSafeJSON() {
    return { id: this.id, email: this.email, name: this.name };
  }
}

export function initUserModel(sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    },
  );

  return User;
}
