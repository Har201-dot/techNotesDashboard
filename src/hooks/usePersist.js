import { useEffect, useState } from "react";

const usePersist = () => {
	const [persist, usePersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

	useEffect(() => {
		localStorage.setItem("persist", JSON.stringify(persist));
	}, [persist]);

	return [persist, usePersist];
};

export default usePersist;
