import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function PageNotFound() {
    return (
        <div style={{minHeight: "calc(100vh - 13.6rem)"}}>
            <div className="not_found">
                <div className="not_found_body">
                    <h1>4</h1>
                    <FontAwesomeIcon className="not_found_gear" icon={faGear} />
                    <FontAwesomeIcon className="not_found_gear2" icon={faGear} />
                    <h1>4</h1>
                </div>
                <h2>Sahifa topilmadi!</h2>
            </div>
        </div>
    )
}
