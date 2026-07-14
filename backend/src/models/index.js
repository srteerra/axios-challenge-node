import { sequelize } from '../config/database.js';
import { initUserModel } from './user.model.js';
import { initFavoriteModel } from './favorite.model.js';
import { initTeamModel } from './team.model.js';
import { initTeamMemberModel } from './team-member.model.js';

const User = initUserModel(sequelize);
const Favorite = initFavoriteModel(sequelize);
const Team = initTeamModel(sequelize);
const TeamMember = initTeamMemberModel(sequelize);

User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Team, { foreignKey: 'userId', as: 'teams', onDelete: 'CASCADE' });
Team.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Team.hasMany(TeamMember, { foreignKey: 'teamId', as: 'members', onDelete: 'CASCADE' });
TeamMember.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

export { sequelize, User, Favorite, Team, TeamMember };
