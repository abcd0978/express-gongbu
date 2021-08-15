const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model
{
    static init(sequelize)
    {
        return super.init({
            comment:
            {
                type: Sequelize.STRING(200),
                allowNull:false,
            },
            password:
            {
                type: Sequelize.STRING(20),//로그인한 유저가 글을쓰면 이 열은 null이되고 user_id가 채워진다.
                allowNull: true,
            },
            user_id:
            {
                type: Sequelize.INTEGER,
                aloowNull:true,//익명의 유저가 글을 쓰면 이 열은 null이되고 password와 who,ip가 채워진다.
            },
            post_id:
            {
                type: Sequelize.INTEGER,
                allowNull:false,//댓글은 항상 특정 글에 속해있으므로 post_id는 null이 될수 없다
            },
            ip:
            {
                type:Sequelize.STRING(20),//로그인한 유저가 글을쓰면 이 열은 null이되고 user_id가 채워진다.
                allowNull:true,
            },
            who:
            {
                type:Sequelize.STRING(20),//로그인한 유저가 글을쓰면 이 열은 null이되고 user_id가 채워진다.
                allowNull:true,
            },
        },
        {
            sequelize,
            timestamps: true,//createdAt, createdAt row를 만들어줌.
            paranoid: true,//deletedAt일자 만들어줌(softdelete)
            modelName: 'Comment',//모델이름
            tableName: 'comments',//테이블명 즉 sql에서 쓰는이름
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db)
    {
        db.Comment.belongsTo(db.User,{foreignKey:'user_id', sourceKey:'user_id'});//comment는 User에 속한다.
        db.Comment.belongsTo(db.Post,{foreignKey:'post_id', sourceKey:'post_id'});//comment는 post에 속한다.
    }
}