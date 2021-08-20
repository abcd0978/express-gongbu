const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model
{
    static init(sequelize)
    {
        return super.init({
            title://제목
            {
                type: Sequelize.STRING(200),
                allowNull:false,
            },
            content://글
            {
                type:Sequelize.TEXT,
                allowNull:false,
            },
            password://비밀번호
            {
                type: Sequelize.STRING(20),//로그인한 유저가 글을쓰면 이 열은 null이되고 user_id가 채워진다.
                allowNull: true,
            },
            user_id://유저아이디
            {
                type: Sequelize.INTEGER,
                aloowNull:true,//익명의 유저가 글을 쓰면 이 열은 null이되고 password와 who,ip가 채워진다.
            },
            post_id://게시글 아이디
            {
                type:Sequelize.INTEGER,
                unique:true,
                primaryKey:true,
                autoIncrement:true,
            },
            ip://아이피
            {
                type:Sequelize.STRING(20),//로그인한 유저가 글을쓰면 이 열은 null이되고 user_id가 채워진다.
                allowNull:true,
            },
            who://익명의 유저가쓰는 이름
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
            },
            view://조회수
            {
                type: Sequelize.INTEGER,
                defaultValue:"1",
            },
            wchboard://어느 게시판에 속해있는지 보기 위해서
            {
                type: Sequelize.STRING(20),
                allowNull:false,
            },
            thmsup://좋아요
            {
                type: Sequelize.INTEGER,
                defaultValue:0,
            },
            thmsdwn://싫어요
            {
                type: Sequelize.INTEGER,
                defaultValue:0,
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
            initialAutoIncrement: '1',
        });
    }
    static associate(db)
    {
        db.Post.belongsTo(db.User,{foreignKey:'user_id', sourceKey:'user_id'});//Post는 User에 속한다.
        db.Post.hasMany(db.Comment,{foreignKey:'post_id',sourceKey:'post_id'});
    }
}