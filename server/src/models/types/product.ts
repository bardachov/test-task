export default interface Product {
    name: string,
    description: string,
    price: number,
    image: {
        filename: string,
        path: string,
        base64encode: string
    },
};