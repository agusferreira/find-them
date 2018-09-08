import moment from 'moment';


export const dateFormat = (value) => {
    if(value.trim() === '-') return value;
    try{
        let newValue = moment(value).format('DD/MM/YYYY');
        return newValue === 'Invalid date' ? value : newValue;
    }
    catch (e){
        console.log(e);
    }
    return value;
}