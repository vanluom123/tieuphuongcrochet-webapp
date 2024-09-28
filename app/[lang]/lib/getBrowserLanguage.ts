const getBrowserLanguage = () => {
    if (typeof window !== 'undefined' && navigator) {
        return navigator.language || 'vi';
    }
    return 'vi'; // Default language
};

export default getBrowserLanguage;