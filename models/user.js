const Sequelize = require('sequelize')//sequlize 갖고옴

module.exports = class User extends Sequelize.Model
{
    static init(sequelize)
    {
        return super.init(
            {
                name://이름
                {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                },
                id://아이디
                {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                },
                pass://비번
                {
                    type: Sequelize.STRING(300),
                    allowNull: false,
                },
                email://이메일
                {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                },
                salt://솔트
                {
                    type: Sequelize.STRING(300),
                    allowNull: false,
                },
                pic://프로필사진 경로
                {
                    type:Sequelize.STRING(200),
                    allowNull:true,
                },
                user_id: //PK
                {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
            },
            {
                sequelize,
                timestamps: true,//생성한날짜, 업데이트한날짜 row를 만들어줌.
                underscored: true,//camel와 _의 차이
                paranoid: true,//deletedAt일자 만들어줌(softdelete)
                modelName: 'User',//모델이름
                tableName: 'users',//테이블명 즉 sql에서 쓰는이름 
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
    }
    static associate(db)
    {
        db.User.hasMany(db.Comment,{foreignKey:'user_id', sourceKey:'user_id'});//유저가 comment를 많이 갖는다 (hasMany)
        db.User.hasMany(db.Post,{foreignKey:'user_id', sourceKey:'user_id'});//유저가 post를 많이 갖는다 (hasMany)
    }
}