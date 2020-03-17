export const utils = {
    last: function(array) {
        return array[array.length - 1];
    },
    get_years_array: function(size, start_year) {
        let years = [];
        for (let i = 0; i < size; i++) {
            const x = i + start_year;
            years.push(x.toString());
        }
        return years;
    },
};