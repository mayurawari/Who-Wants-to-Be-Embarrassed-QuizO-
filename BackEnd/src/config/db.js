import { connect } from "mongoose"


const connectDB = async(url) =>{
    await connect(url);
}

export default connectDB;