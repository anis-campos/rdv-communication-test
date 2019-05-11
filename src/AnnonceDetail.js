import React, {Component} from 'react';


export class AnnonceDetail extends Component {

    /**
     *
     * @type {Annonce}
     */
    state = {
        title: "", images: [], criteria: [], price: "", date: "", seller: "", phone: ""
    };

    componentWillMount() {
        const {match} = this.props;
        fetch(`api/annonces/${match.params.id}`).then(async (response) => {
            const data = await response.json();
            return this.setState(data);
        })
    }

    render() {
        const {title, images, criteria, price, date, seller, phone} = this.state;
        return (
            <div>
                <h1>{title}</h1>
                {images && images.map((src, i) => (
                    <img src={src} key={`img.${i}`}/>
                ))}
                {criteria.map((x, i) => (
                    <div key={`criteria.${i}`}>
                        Name:<span>{x.name}</span>
                        Value:<span>{x.value}</span>
                    </div>
                ))}
                <h2>{price}</h2>
                <h2>{date}</h2>
                <h2>{seller}</h2>
                <h2>{phone}</h2>

            </div>

        )
    }
}
