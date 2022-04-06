export default function Location(props){
    return (
        <button onClick={props.get} style={props.style} className="component-container">
            <span className="component-text location-name">{props.name}</span>
            <span className="component-text">{props.status}</span>
        </button>
    )
}