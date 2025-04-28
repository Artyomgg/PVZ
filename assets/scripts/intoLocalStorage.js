export function IntoLocalStorage(number){
	const array = []
	for(let i = 0; i > array.length; i++){
		
		if(!number == array[i]){
			array.push(number)
			localStorage.setItem('winning-levels', array)
		} else{
			return console.log('Этот уровень уже пройден')
		}
	}
	localStorage.setItem('winning-levels', array)
}