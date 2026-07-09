import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useHighlight() {

    const location = useLocation();

    const [highlightId, setHighlightId] = useState(

        location.state?.highlightId || null

    );

    useEffect(() => {

        if (!location.state?.highlightId) return;

        setHighlightId(location.state.highlightId);

    }, [location.state]);

    useEffect(() => {

        if (!highlightId) return;

        const timer = setTimeout(() => {

            setHighlightId(null);

        }, 4000);

        return () => clearTimeout(timer);

    }, [highlightId]);

    return highlightId;

}