const isEmpty = (value: string | number | null | undefined): boolean => value === '' || value === 0 || value === null || value === undefined;

export default isEmpty;