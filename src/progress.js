import React, {useEffect, useState} from "react";
import "./styles/auth.css";
import one from "./images/1star.svg";
import two from "./images/2star.svg";
import three from "./images/3star.svg";
import four from "./images/4star.svg";
import five from "./images/5star.svg";

const Progress = ({extra}) => {
    const [level, setLevel] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("data")) {
            let points = JSON.parse(localStorage.getItem("data")).points;

            if (0 <= points &&
            100 > points) {
                setLevel(1);
            } else if(100 <= points &&
                250 > points) {
                setLevel(2);
            } else if(250 <= points &&
                500 > points) {
                setLevel(3);
            } else if(500 <= points &&
                1000 > points) {
                setLevel(4);
            } else if(1000 <= points) {
                setLevel(5);
            }
        }
    }, []);

    const handleLevel = (num) => {
        switch (num) {
            case 1:
                return one;
            case 2:
                return two;
            case 3:
                return three;
            case 4:
                return four;
            case 5:
                return five;
            default:
                return one;
        }
    }
    const handleLevel2 = (num) => {
        switch (num) {
            case 1:
                return 100;
            case 2:
                return 250;
            case 3:
                return 500;
            case 4:
                return 1000;
            case 5:
                return 1000;
            default:
                return 100;
        }
    }

    return <>
        <div className="w-100 d-flex py-3">
            <div className="progress-img">
                <img src={handleLevel(level)} alt="level"/>
            </div>
            <div className="d-flex flex-wrap pe-3 w-100">
                <label htmlFor="file" className="w-100 text-white fs-5 d-flex justify-content-start align-items-center">{localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")).points : null}</label>
                <progress className="w-100" id="file" value={localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")).points + extra: 0} max={handleLevel2(level)}></progress>
            </div>
        </div>
    </>
}

export { Progress };