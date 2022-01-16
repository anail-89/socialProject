module.exports = (sequelize, DataTypes) => {
    const Messages = sequelize.define('messages', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        underscored: true,
        timestamps: true
    });

    return Messages;
}