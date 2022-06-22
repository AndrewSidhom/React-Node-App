import React, { useEffect } from 'react';
import { useParams } from "react-router";

function Comic() {
    //add states called img, error, etc to the component
    const [image, setImage] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [id, setId] = React.useState(null);
    const [transcript, setTranscript] = React.useState(null);
    const [titleText, setTitleText] = React.useState(null);
    const [date, setDate] = React.useState(null);

    var { comicId } = useParams();
    if (!comicId){
        var url =  "/api/comics/latest";
    } 
    else {
        url =  "/api/comics/" + comicId;
    }

    //executed when component is rendered or updated. Similar to componentDidMount and componentDidUpdate in a class.
    //Whatever is in the [] array indicates which variables' updates result in execution of the useEffect function.
    useEffect(() => {
        fetch(url).then(res => {
            if (!res.ok){
                var res_err = {"Status Code": res.status, "Message": res.statusText};
                setId(parseInt(comicId));
                return Promise.reject(res_err);
            }
            return res.json();
        }).then((res_json) => {
            setId(parseInt(res_json.num));
            setImage(res_json.img);
            var regex = new RegExp("\{\{(.+)\}\}");
            var match = res_json.transcript.match(regex);
            if (match){
                setTitleText(match[1]);
                var curlyBracesFirstIndex = res_json.transcript.indexOf("{{");
                var transcript = res_json.transcript.substring(0, curlyBracesFirstIndex);
                setTranscript(transcript);
            }
            else{
                setTranscript(res_json.transcript);
            }
            var newDate = new Date(parseInt(res_json.year), parseInt(res_json.month), parseInt(res_json.day));
            setDate(newDate);

        }).catch((res_err) => {
            setError(res_err);
        })
    });
    
    return (
        <div id="root" className="flex-container-col">
            <div className="flex-item-row-1">
                { !id ? <div></div> : <a href={"/comics/"+(id-1)} className="custom-button">&#8249;</a>}
                {(!image && !error) ? "Loading..." : (image ? 
                    <img src={ image } max-width="100vw" max-height="75vh" object-fit="contain"/> 
                    : <h3> { JSON.stringify(error) } </h3>)}
                { !id ? <div></div> : <a href={"/comics/"+(id+1)} className="custom-button">&#8250;</a>}
            </div>
            <div className="flex-item-row-2">
                <p className="center-text bold-text" style={{color:"darkblue"}}>Comic date: { date ? date.toDateString() : "N/A" }</p>
                <p className="center-text bold-text" style={{color:"darkgreen"}}>{ titleText }</p>
                <p className="center-text">{ transcript }</p>
            </div>
        </div>
    );
}

export default Comic;