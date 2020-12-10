const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const Track = require("../models/Track");
const Artist = require("../models/Artist");
const Album = require("../models/Album");
const User = require("../models/User");
const Group = require("../models/Group");
const Mixtape = require("../models/Mixtape");
const Like = require("../models/Like");

const { getUserById } = require('./users');

const getTrackHelper = async (id) => await Track.findById(id).catch((err) => { return null });

module.exports.getTrack = async (req, res) => {
    console.log(req.params.id);
    Track.findById(req.params.id).then(track => {
        if (track) {
            return res.status(httpStatus.OK).json({ track: track });
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `there are no tracks found with id ${req.params.id}` });
        }
    })
}

module.exports.getArtist = function (req, res) {
    console.log(req.params.id);
    Artist.findById(req.params.id).then(artist => {
        if (artist) {
            return res.status(httpStatus.OK).json({ artist: artist });
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `there are no artist found with id ${req.params.id}` });
        }
    })
}

module.exports.getAlbum = function (req, res) {
    console.log(req.params.id);
    Album.findById(req.params.id).then(album => {
        if (album) {
            return res.status(httpStatus.OK).json({ album: album });
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `there are no album found with id ${req.params.id}` });
        }
    })
}

module.exports.search = async (req, res) => {
    let searchName = req.query.name;
    var tracks = await Track.find({ title: { $regex: searchName, $options: 'i' } });
    var artists = await Artist.find({ name: { $regex: searchName, $options: 'i' } });
    var users = await User.find({ username: { $regex: searchName, $options: 'i' } });
    var groups = await Group.find({ name: { $regex: searchName, $options: 'i' } });
    var mixtapes = await Mixtape.find({ name: { $regex: searchName, $options: 'i' } });
    var albums = await Album.find({ name: { $regex: searchName, $options: 'i' } });

    let results = []
    tracks.splice(0, 3).forEach(track => results.push({ _id: track._id, title: track.title, picture: track.cover_picture, url: `/track/${track._id}` }));
    artists.splice(0, 3).forEach(artist => results.push({ _id: artist._id, title: artist.name, picture: artist.artist_cover, url: `/artist/${artist._id}` }));
    users.splice(0, 3).forEach(user => results.push({ _id: user._id, title: user.name, picture: user.profile_picture, url: `/user/${user._id}` }));
    groups.splice(0, 3).forEach(group => results.push({ _id: group._id, title: group.name, url: `/group/${group._id}` }));
    mixtapes.splice(0, 3).forEach(mixtape => results.push({ _id: mixtape._id, title: mixtape.name, picture: mixtape.mixtape_cover, url: `/mixtape/${mixtape._id}` }));
    albums.splice(0, 3).forEach(album => results.push({ _id: album._id, title: album.title, url: `/album/${album._id}` }));

    return res.status(httpStatus.OK).json({ results: results });
}

module.exports.likeTrack = async (req, res) => {
    let user = await getUserById(req.params.user_id);
    if (user == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no users found with id ${req.params.user_id}` });
    }

    let track = await Track.findOne({ uri: req.body.track.uri });
    // Create track if doesn't exist
    if (track == null) {
        let spotify_track = req.body.track;
        // Create Track
        const newTrack = new Track({
            _id: mongoose.Types.ObjectId(),
            name: spotify_track.name,
            artists: spotify_track.artists,
            album: spotify_track.album,
            uri: spotify_track.uri,
            duration_ms: spotify_track.duration_ms
        });

        let retval = await newTrack.save();
        if (retval == null){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `track could not be saved.`});
        }
        // Define track after creating
        track = newTrack;
    }

    // Create like if does not exist
    let like = await Like.findOne({ object_id: track._id });
    if (like == null) {
        // Create Like
        const newLike = new Like({
            _id: mongoose.Types.ObjectId(),
            object_type: "TRACK",
            object_id: track._id,
            num_of_likes: 1,
            who_likes: []
        });
        // Add user to liked array
        newLike.who_likes.push(req.params.user_id)
        let retval = await newLike.save();
        if (retval == null){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `like could not be saved.`});
        }

        let new_track = {
            uri: track.uri,
            name: track.name
        };
        user = await User.findOneAndUpdate({"_id": user._id}, {$push: {liked_tracks: new_track }}, {new: true});
        if (user == null){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `user could not be updated.`});
        }
        // Return successful like
        return res.status(httpStatus.OK).json({ user: user, like: newLike });
    }

    // Bad request if user has already liked
    if (like.who_likes.includes(user._id)) {
        return res.status(httpStatus.BAD_REQUEST).json({ error: `User has already liked the object`});
    }

    // Update and return success
    like = await Like.findOneAndUpdate({"_id": like._id}, {$push: {who_likes: user._id }}, {new: true});
    if (like == null){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `like could not be updated.`});
    }
    let new_track = {
        uri: track.uri,
        name: track.name
    };
    user = await User.findOneAndUpdate({"_id": user._id}, {$push: {liked_tracks: new_track }}, {new: true});
    if (user == null){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `user could not be updated.`});
    }

    return res.status(httpStatus.OK).json({ user: user, like: like });
}

module.exports.unlikeTrack = async (req, res) => {
    let track = await Track.findOne({ uri: req.body.track_uri });
    if (track == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no tracks found with track uri ${req.body.track_uri}` });
    }
    let user = await getUserById(req.params.user_id);
    if (user == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no users found with id ${req.params.user_id}` });
    }
    let like = await Like.findOne({ object_id: track._id });
    if (like == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no likes found with an object ID of id ${track._id}` });
    }

    let update_query = {
        "$set": {
            "num_of_likes": like.num_of_likes - 1
        },
        "$pull": {
            who_likes: user._id
        }
    };
    like = await Like.findOneAndUpdate({ object_id: track._id }, update_query, {new: true});
    if (like == null){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `like could not be updated.`});
    }

    user = await User.findOneAndUpdate({ _id: user._id }, {"$pull" : {liked_tracks: { uri: track.uri } } } , {new: true});
    if (user == null){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `user could not be updated.`});
    }

    return res.status(httpStatus.OK).json({ user: user, like: like });
}
