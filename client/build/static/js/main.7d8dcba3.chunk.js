(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{28:function(e,t,n){},29:function(e,t,n){},33:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(18),c=n.n(o),i=(n(28),n(29),n(11)),u=n(9),s=n(1),f=a.a.createContext();function l(e){var t=Object(u.b)().user;return Object(s.jsx)(f.Provider,Object(i.a)({value:t},e))}var j=n(21),d=n(20),b=n(15);function h(){return Object(s.jsx)("div",{css:{fontSize:"4em",height:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:Object(s.jsx)(p,{})})}var v=Object(b.a)({"0%":{transform:"rotate(0deg)"},"100%":{transform:"rotate(360deg)"}}),p=Object(j.a)(d.a,{target:"eyp5yn80"})({animation:"".concat(v," 1s linear infinite")},"");p.defaultProps={"aria-label":"loading"};var x=a.a.lazy((function(){return Promise.all([n.e(2),n.e(6)]).then(n.bind(null,280))})),O=Promise.all([n.e(4),n.e(5)]).then(n.bind(null,281));var m=function(){var e=function(){var e=a.a.useContext(f);if(void 0===e)throw new Error("useUser must be used within a UserProvider");return e}();return Object(s.jsx)(a.a.Suspense,{fallback:Object(s.jsx)(h,{}),children:e?Object(s.jsx)(x,{}):Object(s.jsx)(O,{})})};var g=function(e){var t=e.children;return Object(s.jsx)(u.a,{children:Object(s.jsx)(l,{children:t})})};c.a.render(Object(s.jsx)(g,{children:Object(s.jsx)(m,{})}),document.getElementById("root"))},9:function(e,t,n){"use strict";n.d(t,"a",(function(){return j})),n.d(t,"b",(function(){return d}));var r=n(11),a=n(8),o=n.n(a),c=n(17),i=n(0),u=n.n(i),s=n(19),f=n(1),l=Object(i.createContext)();function j(e){var t=Object(s.a)("/api/v1/auth/me"),n=t.data,a=t.error,i=t.mutate,u=function(){var e=Object(c.a)(o.a.mark((function e(t){var n,r;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/v1/auth/google",{method:"POST",body:JSON.stringify({token:t.tokenId}),headers:{"Content-Type":"application/json"}});case 2:return n=e.sent,e.next=5,n.json();case 5:if(!(r=e.sent).error){e.next=8;break}throw new Error(r.error);case 8:i();case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),j=function(){var e=Object(c.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/v1/auth/logout",{method:"DELETE"});case 2:i();case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(f.jsx)(l.Provider,Object(r.a)({value:{user:n,error:a,googleLogIn:u,logOut:j}},e))}var d=function(){var e=u.a.useContext(l);if(void 0===e)throw new Error("useAuth must be used within a AuthProvider");return e}}},[[33,1,3]]]);
//# sourceMappingURL=main.7d8dcba3.chunk.js.map