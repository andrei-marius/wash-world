export default function Product(props){
    return (
        <button onClick={props.post} className="component-container">
            <span className="component-text">{props.name}</span>
            <span className="component-text">{props.description}</span>
            <span className="component-text">{props.price} kr.</span>
        </button>
    )
}