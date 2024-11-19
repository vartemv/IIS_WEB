export const DateProcessor = {

getCurrentDateString () {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}T00:00:00.000Z`;
}

}