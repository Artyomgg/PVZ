export function IntoLocalStorage(number) {
	// Получаем массив из localStorage или создаем новый, если его нет
	const storedArray = JSON.parse(localStorage.getItem('passedLevels')) || []

	// Проверяем, есть ли число в массиве
	if (!storedArray.includes(number)) {
		// Если числа нет, добавляем его в массив
		storedArray.push(number)
		// Сохраняем обновленный массив обратно в localStorage
		localStorage.setItem('passedLevels', JSON.stringify(storedArray))
		console.log('Уровень успешно сохранен')
	} else {
		console.log('Этот уровень уже пройден')
	}
}
