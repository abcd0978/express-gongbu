const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model
{
    static init(sequelize)
    {
        return super.init({
            title:
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
                type:Sequelize.INTEGER,
                allowNull:false,//primaryKey이므로 null이 될수 없다
                unique:true,
                primaryKey:true,
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
            numOfCom://댓글의 갯수
            {
                type:Sequelize.INTEGER,
                defaultValue:"0",
            },
            isimg://이미지가 있는 게시물인지 확인하는 컬럼
            {
                type: Sequelize.INTEGER,
                allowNull:false,//확인하자
            }
        },
        {
            sequelize,
            timestamps: true,//createdAt, createdAt row를 만들어줌.
            paranoid: true,//deletedAt일자 만들어줌(softdelete)
            modelName: 'Post',//모델이름
            tableName: 'posts',//테이블명 즉 sql에서 쓰는이름 
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db)
    {
        db.Post.belongsTo(db.User,{foreignKey:'user_id', sourceKey:'user_id'});//Post는 User에 속한다.
        db.Post.hasMany(db.Comment,{foreignKey:'post_id',sourceKey:'post_id'});
    }
}