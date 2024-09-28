import en from '@/dictionaries/en-US'
import vi from '@/dictionaries/vi-VN'
import getBrowserLanguage from './getBrowserLanguage';

const useTrans = () => {
    const local = getBrowserLanguage();  
    console.log('local', local);  
    const trans = local.includes('vi') ? vi : en;
    return trans;
}

export default useTrans;