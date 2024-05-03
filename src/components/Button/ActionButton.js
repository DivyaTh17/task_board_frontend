import { Button } from "react-bootstrap"
import './ActionButton.css'

export const ActionButton = ({
    onClick,
    icon,
    text,
}) => {
    return(
        <Button 
        onClick={onClick} 
        className={`custom-action-button ${text ? 'with-text' : ''}`}>
        {/* Option to give icon or text inside a button */}
        {icon && <span className="action-button-icon">{icon}</span>}
        {text && <span className="action-button-text">{text}</span>}
        </Button>
    )
}