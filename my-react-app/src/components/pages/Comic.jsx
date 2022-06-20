import React, { useEffect } from 'react';
import { useParams } from "react-router";

function Comic() {
    var { comicId } = useParams();
    return (
        <img src="" max-width="100vw" max-height="100vh">
    );
}

export default Comic;