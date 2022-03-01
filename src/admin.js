import React, {useEffect, useState} from "react";

import axios from "axios";
import { Nav } from "./home";


const ManageChallenge = ({ addOrUpadate }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [testing, setTesting] = useState([]);
    const [forbidden, setForbidden] = useState([]);
    const [data, setData] = useState({
        name: "",
        type: "easy",
        description: "",
        funcName: "",
        solution: ""
    });

    useEffect(() => {
        if (localStorage.getItem("data")) {
            let userName = JSON.parse(localStorage.getItem("data")).userName;
            let password = JSON.parse(localStorage.getItem("data")).password;

            if (userName === "admin1" && password === "www@$WWW_gtav5532759") {
                setIsAdmin(true);
            }
        }
        if (addOrUpadate === "update") {
            let id = window.location.pathname.replace("/admin/update/", "");
            fetch(`/challenges/${id}`)
                .then(res => res.json())
                .then(data => {
                    setData(data);
                    setTesting(JSON.parse(data.testing));
                    setForbidden(data.forbidden);

                    for (let i = 0; i < JSON.parse(data.testing).length; i++) {
                        document.getElementById(`input-${i}`).value = JSON.stringify(JSON.parse(data.testing)[i].input);
                        document.getElementById(`result-${i}`).value = JSON.stringify(JSON.parse(data.testing)[i].result);
                    }

                    for (let j = 0; j < data.forbidden.length; j++) {
                        document.getElementById(`forbidden-${j}`).value = data.forbidden[j];
                    }

                })
                .catch(err => console.log(err));
        }
    }, []);

    const handleTestingInput = (e) => {
        const index = parseInt(e.target.name);
        const value = e.target.value;

        testing[index].input = value;
        setTesting(testing);
    }
    const handleTestingResult = (e) => {
        const index = parseInt(e.target.name);
        const value = e.target.value;

        testing[index].result = value;
        setTesting(testing);
    }

    const handleChangeForbidden = (e) => {
        const index = parseInt(e.target.name);
        const value = e.target.value;

        forbidden[index] = value;
        setForbidden(forbidden);
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        
        setData({ ...data, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let finaltesting = testing.filter(obj => obj.input.length > 0 && obj.result.length > 0)
            .map(obj => { return { input: JSON.parse(obj.input), result: JSON.parse(obj.result) } });

        let finalForbidden = forbidden.filter(str => str.length > 0);

        let finalData;
        
        finalData = {...data, testing: JSON.stringify(finaltesting), finalForbidden};

        if (addOrUpadate === "add") {
            
            axios.post("/challenges", finalData)
            .then((res) => {
                if (res.data = "new challenge added !") {
                    alert("تمت إضافة تحدى جديد بنجاح");
                }
            })
            .catch(err => alert(err));
        } else if (addOrUpadate === "update") {
            let id = window.location.pathname.replace("/admin/update/", "");

            axios.put(`/challenges/${id}`, finalData)
            .then((res) => {
                if (res.data = "challenge updated!") {
                    alert("تم تعديل التحدى بنجاح");
                }
            })
            .catch(err => alert(err));
        }
    }
    if (isAdmin) {
        return <>
            <Nav />
            <form className="top container" onSubmit={(e) => handleSubmit(e)}>
                <h3 className="text-white py-3 text-center">
                    {
                        addOrUpadate === "add" ?
                            "إضافة تحدى جديد"
                            :
                            "تعديل تحدى موجود سابقا"
                    }
                </h3>
                <div className="row my-4">
                    <label className="form-label fs-4 g px-0" htmlFor="name">إسم التحدي</label>
                    <input type="text"
                        id="name"
                        placeholder="إسم التحدي"
                        className="form-control w-100 fs-5 admin-input"
                        spellCheck="false"
                        autoComplete="off"
                        required
                        value={data.name}
                        name="name"
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div className="row my-4">
                    <label className="form-label fs-4 g px-0" htmlFor="type">مستوى التحدي</label>
                    <select className="text-center"
                        id="type"
                        required
                        value={data.type}
                        name="type"
                        onChange={(e) => handleChange(e)}
                    >
                        <option value="easy">easy</option>
                        <option value="normal">normal</option>
                        <option value="hard">hard</option>
                        <option value="very-hard">very-hard</option>
                    </select>
                </div>
                <div className="row my-4">
                    <label className="form-label fs-4 g px-0" htmlFor="description">وصف التحدى</label>
                    <ul className="text-info">
                        <li>{`كي تظلل كلمة`}<pre className="text-info rtl m-0">{`<mark>key word</mark> `}</pre></li>
                        <li>{`كي تضيف قائمة`}<pre className="text-info rtl m-0">{`<li>key word</li> `}</pre></li>
                        <li>{`كي تضيف رابط`}<pre className="text-info rtl m-0">{`<a href='url'>key word</a> `}</pre></li>
                        <li>أي سطر جديد تقوم بعمله يظهر كما هو </li>
                    </ul>
                    <textarea
                        id="description"
                        placeholder="وصف التحدى"
                        spellCheck="false"
                        autoComplete="off"
                        className="fs-5 text-dark admin-textarea"
                        rows="10"
                        required
                        value={data.description}
                        name="description"
                        onChange={(e) => handleChange(e)}
                    >
                    </textarea>
                </div>
                <div className="row my-4">
                    <label className="form-label fs-4 g px-0" htmlFor="testing">تجارب الكود</label>
                    {
                        testing.length > 0 ?
                            testing.map((a, i) => {
                                return <div className="d-flex flex-wrap justify-content-between my-3 mx-0 border-info border rounded p-3 border-2" key={i}>
                                    <h5 className="pb-2 text-white w-100">تجربة {i + 1}</h5>
                                    <label className="form-label fs-5 g px-0" htmlFor={`input-${i}`}>المدخلات</label>
                                    <input
                                        spellCheck="false"
                                        autoComplete="off"
                                        placeholder={addOrUpadate === "add" ? "[json]" : JSON.stringify(testing[i].input)}
                                        className="form-control fs-5 ltr ff-code admin-input"
                                        type="text"
                                        id={`input-${i}`}
                                        name={i}
                                        onChange={(e) => handleTestingInput(e)}
                                    />
                                    <label className="form-label fs-5 g px-0" htmlFor={`result-${i}`}>المخرجات</label>
                                    <input
                                        spellCheck="false"
                                        autoComplete="off"
                                        placeholder={addOrUpadate === "add" ? "[json]" : JSON.stringify(testing[i].result)}
                                        className="form-control fs-5 ltr ff-code admin-input"
                                        type="text"
                                        id={`result-${i}`}
                                        name={i}
                                        onChange={(e) => handleTestingResult(e)}
                                    />
                                    <p className="w-100 text-danger text-center pt-2">إذا كنت تريد حذفها فاتركها فارغة.</p>
                                </div>
                            })
                            : null
                    }
                    <button type="button" className="btn btn-success w-100 fw-bold"
                        onClick={() => setTesting([...testing, { input: "", result: "" }])}
                    >أضف</button>
                </div>
                <div className="row my-4">
                    <label className="form-label fs-4 g px-0" htmlFor="funcName">اسم ال function</label>
                    <input type="text"
                        id="funcName"
                        placeholder="اسم ال function"
                        className="form-control w-100 fs-5 admin-input"
                        spellCheck="false"
                        autoComplete="off"
                        required
                        value={data.funcName}
                        name="funcName"
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div className="row my-4">
                    <label className="form-label fs-4 g px-0" htmlFor="solution">الحل</label>
                    <textarea type="text"
                        id="solution"
                        placeholder="الحل"
                        spellCheck="false"
                        autoComplete="off"
                        required
                        value={data.solution}
                        name="solution"
                        className="fs-5 text-dark admin-textarea ff-code ltr"
                        rows="10"
                        onChange={(e) => handleChange(e)}
                    ></textarea>
                </div>
                <div className="row my-4">
                    <label className="form-label fs-4 g px-0" htmlFor="testing">أشياء لا يجب أن تكون في الكود</label>
                    {
                        forbidden.length > 0 ?
                            forbidden.map((a, i) => {
                                return <div className="d-flex flex-wrap justify-content-between my-3 mx-0 border-info border rounded p-3 border-2" key={i}>
                                    <input
                                        spellCheck="false"
                                        autoComplete="off"
                                        placeholder={addOrUpadate === "add" ? "key word" : forbidden[i]}
                                        className="form-control fs-5 ltr ff-code admin-input"
                                        type="text"
                                        id={`forbidden-${i}`}
                                        name={i}
                                        onChange={(e) => handleChangeForbidden(e)}
                                    />
                                    <p className="w-100 text-danger text-center pt-2">إذا كنت تريد حذفها فاتركها فارغة.</p>
                                </div>
                            })
                            : null
                    }
                    <button type="button" className="btn btn-success w-100 fw-bold"
                        onClick={() => setForbidden([...forbidden, ""])}
                    >أضف</button>
                </div>
                <button type="submit" className="signin w-100 py-2 text-center fw-bold fs-5 my-4">
                    {
                        addOrUpadate === "add" ?
                            "أضف"
                            :
                            "تعديل"
                    }
                </button>
            </form>
        </>
    } else {
        return <>
        <Nav/>
            <section className="top container">
                <h1 className="text-danger text-center w-100">اسم المستخدم أو كلمة المرور غير صحيحة.</h1> 
            </section>
        </>
    }
}

const AdminOptions = () => {
    const [option, setOption] = useState({
        update: "",
        del: "",
    });

    const deleteChallenge = () => {
        axios.delete(`/challenges/${option.del}`, {})
            .then((res) => {
                if (res.data = "challenge deleted!") {
                    alert("تم حذف التحدى بنجاح");
                }
            })
            .catch(err => alert(err));
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        
        setOption({ ...option, [name]: value });
    }

    return <>
        <section className="top container">
            <div className="row my-4">
                <h3 className="g col-12">أضف تحديا جديدا</h3>
                <div className="my-3 col-12 d-flex justify-content-center">
                    <a href="/admin/add" className="signin text-center w-100 text-decoration-none fw-bold py-2">أضف تحديا جديدا</a>
                </div>
            </div>
            <div className="row my-4">
                <h3 className="text-info col-12">تعديل تحدي موجود سابقا</h3>
                <div className="my-3 d-flex col-12 justify-content-between">
                    <input type="text"
                        placeholder="ال id بتاع التحدي"
                        className="w-100 form-control"
                        name="update"
                        value={option.update}
                        onChange={(e) => handleChange(e)}
                    />
                    <a href={`/admin/update/${option.update}`} className="btn btn-info text-center text-decoration-none fw-bold me-3">تعديل</a>
                </div>
            </div>
            <div className="row my-4">
                <h3 className="text-danger col-12">حذف تحدي موجود سابقا</h3>
                <div className="my-3 d-flex col-12 justify-content-between">
                    <input type="text"
                        placeholder="ال id بتاع التحدي"
                        className="w-100 form-control"
                        value={option.del}
                        name="del"
                        onChange={(e) => handleChange(e)}
                    />
                    <button className="btn btn-danger text-center text-decoration-none fw-bold me-3"
                        onClick={() => deleteChallenge()}
                    >حذف</button>
                </div>
            </div>
        </section>
    </>
}

const First = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("data")) {
            let userName = JSON.parse(localStorage.getItem("data")).userName;
            let password = JSON.parse(localStorage.getItem("data")).password;

            if (userName === "admin1" && password === "www@$WWW_gtav5532759") {
                setIsAdmin(true);
            }
        }
    }, []);

    if(isAdmin) {
        return <>
            <Nav />
            <AdminOptions/>
        </>
    } else {
        return <>
        <Nav/>
            <section className="top container">
                <h1 className="text-danger text-center w-100">اسم المستخدم أو كلمة المرور غير صحيحة.</h1> 
            </section>
        </>
    }
}

export { First , ManageChallenge};