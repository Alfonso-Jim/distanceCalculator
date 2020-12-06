<template>
    <section class="origin-destination-form">
        <div class="ui form">
            <div class="ui message red small" v-show="error">{{error}}</div>
            <div class="two fields">
                <div class="field">
                    <div class="ui left icon input">
                        <i class="marker alternate icon"></i>
                        <input type="text" placeholder="Origin" ref="origin"/>
                    </div>
                </div>
                <div class="field">
                    <div class="ui left icon input">
                        <i class="flag checkerd icon"></i>
                        <input type="text" placeholder="Destination" ref="destination"/>
                    </div>
                </div>
                <button class="ui small button green" :class="{loading:spinner}" @click="calculateButtonPressed">Calculate</button>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .origin-destination-form {
        position: relative;
        z-index: 1;
        max-width: 610px;
        margin: 10px;
    }
</style>

<script>
import axios from 'axios';
import firebase from 'firebase';
export default {
    data(){
        return {
            route: {
                origin: {
                    address: "",
                    lat: 0,
                    lng: 0
                },
                destination:{
                    address: "",
                    lat: 0,
                    lng: 0
                },
                distance: {},
                duration: {}

            },
            error:"",
            spinner: false
        };
    },
    mounted() {
        for (let ref in this.$refs) {
            //console.log(this.$refs[ref]);
            const autocomplete = new google.maps.places.Autocomplete(
                this.$refs[ref],
                {
                    bounds: new google.maps.LatLngBounds(
                        new google.maps.LatLng(51.162579, 21.237105)
                    )
                }
            );

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                this.route[ref].address = `${place.name}, ${place.vicinity}`;
                this.route[ref].lat = place.geometry.location.lat();
                this.route[ref].lng = place.geometry.location.lng();
            });
        }
        // const originAutocomple = new google.maps.places.Autocomplete(
        //     this.$refs["origin"],
        //     {
        //         bounds: new google.maps.LatLngBounds(
        //             new google.maps.LatLng(51.162579, 21.237105)
        //         )
        //     }
        // );

        // originAutocomple.addListener("place_changed", () => {
        //     console.log(originAutocomple.getPlace());
        // });

        // const destinationAutocomplete = new google.maps.places.Autocomplete(
        //     this.$refs["destination"],
        //     {
        //         bounds: new google.maps.LatLngBounds(
        //             new google.maps.LatLng(51.162579, 21.237105)
        //         )
        //     }
        // );

        // destinationAutocomplete.addListener("place_changed", () => {
        //     console.log(destinationAutocomplete.getPlace());
        // });
    },
    methods:{
        calculateButtonPressed(){
            this.spinner = true;
            const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.route.origin.lat},${this.route.origin.lng}&destinations=${this.route.destination.lat},${this.route.destination.lng}&key=[YOUR-KEY]`;
            axios
            .get(URL)
            .then(response => {
                if(response.data.error_message){
                    this.error = response.data.error_message;
                } else {
                    const elements = response.data.rows[0].elements;
                    if(elements[0].status === "ZERO_RESULTS") {
                        this.error = "No results found";
                    } else {
                        console.log(elements[0].distance);
                        console.log(elements[0].duration);
                        this.route.distance = elements[0].distance;
                        this.route.duration = elements[0].duration;
                        this.route.color= this.getRandomColor();
                        this.saveRoute();

                    }
                    this.spinner = false;
                    //console.log(response);
                }
                //console.log(response);
            })
            .catch(error => {
                console.log(error.message);
                this.error = error.message;
                this.spinner = false;

            });
        },
        saveRoute(){
            const db = firebase.firestore();
            db.collection("routes").doc().set(this.route);
        },
        getRandomColor(){
            let characters = "0123456789ABCDEF";
            let color = "#";
            for(let i=0; i<6; i++){
                color += characters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    }
}
</script>