import en from '@/dictionaries/en-US'
import vi from '@/dictionaries/vi-VN'

const useTrans = () => {
    const local = navigator.language;

    console.log('local', local);
    
    const trans = local.includes('vi') ? vi : en;

    return trans;
}

export default useTrans