const helpers = {
    coords: (string) => {
        let splits = string.split(',');
        if(splits.length === 2){
            return {lat: parseFloat(splits[0].trim()), lng: parseFloat(splits[1].trim())}
        }
        return false;
    }
};

export default helpers;