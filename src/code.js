import React, {useEffect, useState, useRef} from "react";

// prism //
import Highlight, { defaultProps } from "prism-react-renderer";
import dark from "prism-react-renderer/themes/vsDark";

//
import { Nav } from "./home";
import { Progress } from "./progress";
import "./styles/code.css";
import axios from "axios";
import { ReactComponent as Flag } from "./images/flag.svg";
import { Loader } from "./loader";
import { ReactComponent as Reset } from "./images/reset.svg";
import { ReactComponent as Toggle } from "./images/toggle.svg";

const Test = ({ num, input, result }) => {
    return <>
        <div className="w-100 test">
            <label className="g w-100 fs-5 py-2">تجربة {num}</label>
            <code>
                <pre className="p-2 fs-6 text-light ff-code">
                    <mark className="ff-code me-1">input:</mark>
                    {input}
                    <br/>
                    <mark className="ff-code me-1">result:</mark>
                    {result}
                </pre>
            </code>
        </div>
    </>
}

const Success = ({ userId, challengeName, challengeId, passed, points}) => {
  const fullScreen = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fullScreen.current.style.height = `${window.innerHeight}px`;
    if (passed) {
      axios.put(`/challenges/passed/${challengeId}`);
      axios.put(`/users/passed/${userId}`, { points: points, challengeName: challengeName });
      
      let userData = JSON.parse(localStorage.getItem("data"));
      userData.points = parseInt(userData.points) + parseInt(points);
      userData.passedChallenges = [...userData.passedChallenges, challengeName];
    
      localStorage.setItem("data", JSON.stringify(userData));
    }
  });

  return <>
    <div className="success d-flex justify-content-center align-items-center" ref={fullScreen}>
      <div className="d-flex justify-content-center align-items-center flex-wrap p-3">
        <Progress extra={ 0 } />
        <div className="w-100 my-2 d-flex justify-content-center align-items-center flex-wrap">
          <a href="/challenge" className="text-decoration-none w-100 py-1 btn-2 text-center">قائمة التحديات</a>
          </div>
      </div>
    </div>
  </>
}

const P = ({ str }) => {
  const p = useRef(null);

  useEffect(() => {
    let text = str.replace(/<mark>(.+)<\/mark>/gi, "<mark class='px-1'>$1</mark>")
      .replace(/<li>(.+)<\/li>/gi, "<li class='w-100 text-light d-flex align-items-center'>&#9679;$1</li>")
      .replace(/\n|\r\n|\r/gi, "<br>")
      .replace(/<a href='(.+)'>(.+)<\/a>/gi, "<a href='$1' target='_blank'>$2</a>");
    p.current.innerHTML = text;
  });

  return <>
    <p ref={p} className="text-light w-100"></p>
  </>
}

const Case = ({ your, expected, index }) => {
  const [open, setOpen] = useState(false);
  return <>
  <div className="case my-3 w-100 user-select-none" onClick={() => setOpen(!open)}>
      {JSON.stringify(your) === JSON.stringify(expected) &&
        typeof your === typeof expected ?
        <span className="true fw-bold px-3 py-3 w-100 d-flex justify-content-between align-items-center" key={index}>الحالة {index + 1} (صحيح)
          <button className={`reset ${open ? "rotate-180" : null}`}>
        <Toggle/>  
          </button></span> : <span className="false fw-bold px-3 py-3 w-100 d-flex justify-content-between align-items-center" key={index}>الحالة {index + 1} (خطأ)
        <button className={`reset ${open ? "rotate-180" : null}`}>
        <Toggle/>  
      </button></span>}
      <div className={`w-100 ${open ? "open-solution" : "close-solution"}`}>
      <span
        className="d-flex rtl  p-2 fs-5 align-items-center"
        key={index}>مخرجاتك:   <pre className="w-100 m-0 ff-code">{`${JSON.stringify(your)}(${typeof your})`}</pre>
      </span>
      <span
        className="d-flex rtl p-2 fs-5 align-items-center"
        key={index}>المخرجات المطلوبة: <pre className="w-100 m-0 ff-code">{`${JSON.stringify(expected)}(${typeof expected})`}</pre>
          </span>
    </div>
  </div>
  </>
}

const Console = ({hide}) => {
  return <code className={`w-100 ${hide === "console" ? "" : "d-none"} p-3`}>
    <pre className="ff-code text-white fs-5" id="console">{"//here is console.log output\n"}
    </pre>
  </code>
}

const Code = () => {
    const [before, setBefore] = useState(true);
    const [data, setData] = useState([null]);
    const [workSpace, setWorkSpace] = useState("final");
    const [fontSize, setFontSize] = useState("16");
    const [code, setCode] = useState("");
    const [result, setResult] = useState([]);
    const parent = useRef(null);
    useEffect(() => {
        let id = window.location.pathname.replace("/challenge/", "");
        fetch(`/challenges/${id}`)
            .then(res => res.json())
            .then(data => {
              setData(data);
              setCode(`function ${data.funcName}() {
   // write your function here
}`);
            });
        let elem = document.getElementById("high-light");
        document.getElementById("textarea").style.width = `calc(${window.getComputedStyle(elem).getPropertyValue("width")} - 30px)`;
        document.getElementById("textarea").style.height = `${window.getComputedStyle(elem).getPropertyValue("height")}`;

    }, []);
  
  useEffect(() => {
      window.onresize = () => {
        let elem = document.getElementById("high-light");
        document.getElementById("textarea").style.width = `calc(${window.getComputedStyle(elem).getPropertyValue("width")} - 30px)`;
        document.getElementById("textarea").style.height = `${window.getComputedStyle(elem).getPropertyValue("height")}`;
      }
  });

  const test = async () => {
    setWorkSpace("final");
      let arr = JSON.parse(data.testing);

    let resultArr = arr.map((obj, index) => {
      try {
        return { yourResult: eval(`${code}; ${data.funcName}(...obj.input)`), expectedResult: obj.result[0] };
      } catch (err) {
        if (err instanceof SyntaxError) { 
          return { yourResult: err.toString(), expectedResult: obj.result[0] };
        }
      }
    });
      
      if (data.forbidden.length > 0) {
          data.forbidden.forEach((a, index) => {
              if (code.includes(a)) {
                  resultArr.push(`your code shouldn’t contain ${a}`);
              }
          })
      }
      setResult(resultArr);
    }
  
  function scroll() {
    let y = document.getElementById("textarea").scrollTop;
    let x = document.getElementById("textarea").scrollLeft;
    document.getElementById("high-light").scrollTo(x, y);
  }

  const hardness = (str) => {
    switch (str) {
      case "easy":
        return 10;
      case "normal":
        return 15;
      case "hard":
        return 20;
      case "very-hard":
        return 25;
      default:
        return "";
    }
  }

  const translate = (str) => {
        switch (str) {
      case "easy":
        return "سهل";
      case "normal":
        return "متوسط";
      case "hard":
        return "صعب";
      case "very-hard":
        return "صعب جدا";
      default:
        return "";
    }
  }

  const runConsole = async () => {
    setWorkSpace("console");

    const ourConsole = (p) => {
      document.getElementById("console").innerHTML += `<pre class='d-flex w-100 justify-content-between text-light'>${JSON.stringify(p)}<span>${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}</span></pre>`;
    }
    try {
      eval(`${code.replace(/.*console.log/gi, 'ourConsole')}`);
    } catch (err) {
      if (err instanceof SyntaxError) {
        document.getElementById("console").textContent += err.toString() + "\n";
      }
    }
  }

  const reset = () => {
    document.getElementById("console").textContent = "//here is console.log output" + "\n";
    setCode(`function ${data.funcName}() {
   // write your function here
}`);
  }

    return <>
      <Nav />
      {data.length > 0 ? 
        <Loader />
        : null
      }
      

        <section className="top container-fulid parent overflow-hidden" ref={parent}>
          <div className="row overflow-hidden">
            <section className="col-lg-6 col-12 px-4 py-2 pe-lg-4 ps-lg-2 overflow-hidden">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
              <p className="mb-2 text-secondary w-100 rounded border border-secondary px-3 py-1">لقد إجتاز هذا التحدي : {data.peoplePassed}</p>
              {localStorage.getItem("data")
                ? 
                JSON.parse(localStorage.getItem("data")).passedChallenges.indexOf(data.name) === -1 
                  ?
                <span className="points">
                  {hardness(data.type)}     {"نقطة"}       <Flag />
                </span>
                  :
                  <span className="px-3 py-1 text-dark fw-bold signin my-2 rounded">لقد إجتزت هذا التحدي</span>
                :
                <span className="points">
                  {hardness(data.type)}     {"نقطة"}       <Flag />
                </span>
                }
              </div>
              <span className={`rounded type-${data.type} px-2 py-1 fw-bold my-2 d-inline-block`}>{translate(data.type)}</span>
              <h2 className="text-white">{data.name}</h2>
                <label className="w-100 fs-5 text-white mt-4 mb-2">الوصف :</label>
              <P str={data.description ? data.description : ""} />
              {data.testing ?
                JSON.parse(data.testing).map((obj, index) => {
                  var input = JSON.stringify(obj.input);
                  input = input.split("");
                  input[0] = "";
                  input[input.length - 1] = "";
                  input = input.join("");
                  var result = JSON.stringify(obj.result);
                  result = result.split("");
                  result[0] = "";
                  result[result.length - 1] = "";
                  result = result.join("");
                  return <Test num={index + 1} key={index} input={`${data.funcName}(${input})`} result={result} />
                })
                : null
              } 
              </section>
            <section className="col-lg-6 col-12 d-flex flex-wrap overflow-hidden align-content-start" id="editor">
              <div className="w-100 ltr py-2 px-3 gray d-flex justify-content-between flex-wrap">
                <div className="d-flex justify-content-between align-items-center py-2">
                <button className="signin py-1 px-2 lose" onClick={() => { setCode(data.solution); setBefore(false) }}>أستسلم أرني الكود</button>
                {
                  localStorage.getItem("data") ?
                    <>
                      <button className="signin bg-primary fw-bold py-1 px-2 mx-2" onClick={() => runConsole()}>
                       تشغيل
                      </button>    
                  <button className="signin run py-1 px-2 fw-bold d-flex justify-content-center align-items-center" onClick={() => test()}>
                    إنهاء
                  </button>
                    </>
                  : <a href="/auth" className="signin fw-bold py-1 px-2 me-2">تسجيل الدخول</a>
                }
                </div>
                <div className="d-flex align-items-center">
                  <select className="ltr" onChange={(e) => setFontSize(e.target.value)} value={fontSize}>
                    <option value="12" className="ltr">12 px</option>
                    <option value="14" className="ltr">14 px</option>
                    <option value="16" className="ltr">16 px</option>
                    <option value="18" className="ltr">18 px</option>
                </select>
                <button className="reset py-1 px-2 signin me-2" onClick={() => reset()} aria-label="reset-code">
                  <Reset/>
                </button>
                </div>
              </div>
              <div className="w-100 cont d-flex overflow-hidden">
                <textarea
                wrap="off"
                aria-label="text-editor"
                  value={code}
                  spellCheck="false"
                  onChange={(e) => setCode(e.target.value)}
                  className={`write m-0 ltr text-start overflow-auto fs-${fontSize}`}
                  id="textarea"
                onScroll={() => scroll()}
                >
                </textarea>
                <Highlight {...defaultProps} code={code} language="javascript"
                  className={`textarea ltr ff-code fs-${fontSize}`}
                  theme={dark}>
                  {({ className, style, tokens, getLineProps, getTokenProps }) => {
                    return (
                      <pre className={`${className} textarea  ff-code m-0 p-0 overflow-auto fs-${fontSize}`} style={style} id="high-light">
                        {tokens.map((line, i) => {
                          return (<>
                            <div className="lines-p">
                              <pre className="m-0 p-0 overflow-hidden fs-6 lines">{i + 1}</pre>
                              <div {...getLineProps({ line, key: i })} className="ff-code li">
                                {line.map((token, key) => (
                                  <span className="ff-code" {...getTokenProps({ token, key })} />
                                ))}
                              </div>
                            </div>
                          </>)
                        })}
                      </pre>
                    )
                  }}
              </Highlight>
            </div>
            <div className="w-100 text-white ltr overflow-auto result ff-code" id="result">
              <div className="w-100 ltr py-2 px-3  gray d-flex justify-content-between align-items-center">
                <div className="m-0 p-0 ltr py-2">
                  <button className="signin px-2 py-1 fw-bold" onClick={() => setWorkSpace("final")}>النتيجة النهائية</button>
                  <button className="signin px-2 py-1 fw-bold mx-2 bg-primary" onClick={() => setWorkSpace("console")}>ال console</button>
                </div>
                  <a href="/info" className="text-decoration-none text-white inf border border-white border-2 d-flex justify-content-center align-items-center fs-4">i</a>
              </div>
              {workSpace === "final" ?
                
                result.length > 0 ? result.map((item, index) => {
                  if (typeof item === "object") {
                    return <Case index={index} your={item.yourResult} expected={item.expectedResult} />
                  } else {
                    return <div className="case-forbidden my-3 ff-code p-2 ltr">{item}</div>;
                  }
                }) : "// your results will be here"
                : null
              }

              <Console hide={ workSpace }/>
              </div>
          </section>
          </div>
        </section>
      {result.length > 0 && result.every(obj => typeof obj === "object" && JSON.stringify(obj.yourResult) === JSON.stringify(obj.expectedResult) && typeof obj.yourResult === typeof obj.expectedResult) ? <Success userId={JSON.parse(localStorage.getItem("data"))._id}
        challengeName={data.name}
        challengeId={data._id}
        passed={JSON.parse(localStorage.getItem("data")).passedChallenges.indexOf(data.name) === -1}
        points={before ? parseInt(hardness(data.type)) : 5} /> : null}
      </>
}

export { Code };