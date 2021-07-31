exports.isLoggedIn = (req, res, next) => {
    console.log('호출됨');
    if (req.isAuthenticated()) {
      console.log('isLoggedin에서-- 로그인됨');
      next();
    } else {
      res.redirect('/login');//로그인 페이지로 리다이렉트 된다.
    }
  }
  
exports.isNotLoggedIn = (req, res, next) => {
    console.log('호출됨');
    if (!req.isAuthenticated()) {
      console.log('isNotLoggedin에서-- 로그인풀림');
      next();
    } else 
    {
      const message = encodeURIComponent('로그인한 상태입니다.');
      res.redirect(`/?error=${message}`);
    }
  }