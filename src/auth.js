import React, {useState, useRef, useEffect} from "react";
import axios from "axios";

import invisible from "./images/invisible.png";
import eye from "./images/eye.png";
import "./styles/auth.css";

const LogIn = () => {
    const [see, setSee] = useState(false);
    const wrong = useRef(null);
    const [data, setData] = useState({
        userName: "",
        password: ""
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({...data, [name]: value });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`/users/login`, {userName: data.userName, password: data.password})
            .then(user => {
                if (user.data.length !== 0) {
                    localStorage.setItem("data", JSON.stringify(user.data[0]));
                    window.location.pathname = `/user/${user.data[0]._id}`;
                } else {
                    wrong.current.textContent = "من فضلك تأكد من إسم المستخدم أو كلمة المرور";
                }
            })
            .catch(err => console.log(err));
    }
    return <>
        <form className="w-100 p-4 d-flex justify-content-center flex-wrap" onSubmit={(e) => handleSubmit(e)}>
            <h3 className="text-dark w-100 text-center">تسجيل الدخول</h3>
            <label className="form-label w-100" htmlFor="userName">إسم المستخدم</label>
            <input type="text"
                id="userName"
                autocomplete="off"
                spellCheck="false"
                placeholder="إسم المستخدم"
                name="userName"
                value={data.userName}
                onChange={(e) => handleChange(e)}
            className="w-100 form-control my-2"/>
            <label className="form-label w-100" htmlFor="password">كلمة المرور</label>
            <span className="w-100 d-flex">
            <input type={see ? "text" : "password"}
                className="w-100 form-control my-2"
                    name="password"
                    spellCheck="false"
                    autocomplete="off"
                placeholder="كلمة المرور"
                value={data.password}
                onChange={(e) => handleChange(e)}
                id="password" />
                <button type="button" onClick={() => setSee(!see)} className="px-3">
                    {see ?
                    <img src={invisible} alt="toggle-to-show-password"/>:
                    <img src={eye} alt="toggle-to-show-password"/>
                }
                </button>
            </span>
            <div className="d-flex justify-content-end w-100 my-1">
                <a href="/forgotPassword">نسيت كلمة المرور؟</a>
            </div>
            <p className="w-100 text-center fs-6 text-danger" ref={wrong}></p>
            <button className="signin px-3 py-1 fw-bold fs-5">دخول</button>
        </form>
    </>
}






const SignIn = () => {
    const [see, setSee] = useState(false);
    const wrong = useRef(null);
    const [c, setC] = useState("");
    const [data, setData] = useState({
        userName: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({...data, [name]: value });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (c === data.password && /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(data.password)) {
            
            axios.post(`/users`, data)
            .then(res => {
                if (res.data === "new user added !") {
                    axios.post(`/users/login`, {userName: data.userName, password: data.password})
                    .then(user => {
                        localStorage.setItem("data", JSON.stringify(user.data[0]));
                        window.location.pathname = `/user/${user.data[0]._id}`;
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => wrong.current.textContent = "إسم المستخدم أو البريد الإلكتروني هذا مأخوذ بالفعل");
        } else if(c !== data.password){
            wrong.current.textContent = "يجب أن تكون كلمة المرور مثل تأكيد كلمة المرور";
        } else if (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(data.password) === false) {
            wrong.current.textContent = "يجب أن تحتوي كلمة المرور علي أكثر من 8 أحرف و أن تحتوي علي أرقام و حروف كابيتال و سمال و واحد أو أكثر من العلامات المميزة ";
        }
    }
    return <>
        <form className="w-100 p-4 d-flex justify-content-center flex-wrap" onSubmit={(e) => handleSubmit(e)}>
            <h3 className="text-dark w-100 text-center">إنشاء حساب</h3>
            <label className="form-label w-100" htmlFor="userName">إسم المستخدم</label>
            <input type="text"
                required
                placeholder="إسم المستخدم"
                autocomplete="off"
                id="userName"
                name="userName"
                spellCheck="false"
                value={data.userName}
                onChange={(e) => handleChange(e)}
            className="w-100 form-control my-2"/>
            <label className="form-label w-100" htmlFor="email">البريد الإلكتروني</label>
            <input type="email"
                required
                placeholder="البريد الإلكتروني"
                autocomplete="off"
                id="email"
                name="email"
                spellCheck="false"
                value={data.email}
                onChange={(e) => handleChange(e)}
            className="w-100 form-control my-2"/>
            <label className="form-label w-100" htmlFor="password">كلمة المرور</label>
            <span className="w-100 d-flex">
            <input type={see ? "text" : "password"}
                className="w-100 form-control my-2"
                name="password"
                    placeholder="كلمة المرور"
                    autocomplete="off"
                    spellCheck="false"
                value={data.password}
                onChange={(e) => handleChange(e)}
                id="password" />
                <button type="button" onClick={() => setSee(!see)} className="px-3">
                    {see ?
                    <img src={invisible} alt="toggle-to-show-password"/>:
                    <img src={eye} alt="toggle-to-show-password"/>
                }
                </button>
            </span>
            <label className="form-label w-100" htmlFor="c">تأكيد كلمة المرور</label>
            <input type="password"
                className="w-100 form-control my-2"
                name="c"
                    placeholder="تأكيد كلمة المرور"
                    autocomplete="off"
                    spellCheck="false"
                value={c}
                onChange={(e) => setC(e.target.value)}
                id="c" />
            <p className="w-100 text-center fs-6 text-danger" ref={wrong}></p>
            <button className="signin px-3 py-1 fw-bold fs-5">إنشاء الحساب</button>
        </form>
    </>
}

const Auth = () => {
    const p = useRef(null);
    const [active, setActive] = useState("login");

    useEffect(() => {
        p.current.style.height = `${window.innerHeight}px`;
    }, []);

    return <>
        <section className="container d-flex justify-content-center align-items-center overflow-auto" ref={p}>
            <div className="area row">

    <ul className="nav nav-tabs w-100  d-flex justify-content-end p-0 m-0">
        <li className="nav-item w-50">
            <button className={`nav-link ${active === "signin" ? "active" : ""} w-100 text-dark`}
            onClick={() => setActive("signin")}>حساب جديد</button>
        </li>
        <li className="nav-item w-50">
            <button className={`nav-link ${active === "login" ? "active" : ""} w-100 text-dark`}
            onClick={() => setActive("login")}>تسجيل الدخول</button>
        </li>
    </ul>
        <div className="h w-100 p-0 m-0">
          {active === "login" ? <LogIn/> : <SignIn/>}      
        </div>
        </div>
    </section>
    </>
}

export { Auth };