const httpStatus = require('http-status');

// load models
const Track = require("../models/Track");
const Artist = require("../models/Artist");
const Album = require("../models/Album");
const User = require("../models/User");
const Group = require("../models/Group");
const Mixtape = require("../models/Mixtape");

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
    let track = await Track.findById(req.params.id);
    if (track == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no tracks found with id ${req.params.id}` });
    }
    let user = await getUserById(req.body._id);
    if(user && "liked_tracks" in user && !(user.liked_tracks.some(e => e.equals(track._id)))){
        await Track.findOneAndUpdate({"_id": track._id}, {$inc: {'num_of_likes': 1}})
        let updatedUser = await User.findOneAndUpdate({"_id": user._id}, {$push: {liked_tracks: track._id }}, {new: true});
        // emit an even to all friends who liked the track

        return res.status(httpStatus.OK).json(updatedUser);
    }
    return res.status(httpStatus.BAD_REQUEST).json({error: `You have already liked the track ${track.title}`});
}

module.exports.unlikeTrack = async (req, res) => {
    let track = await Track.findById(req.params.id);
    if (track == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no tracks found with id ${req.params.id}` });
    }
    let user = await getUserById(req.body._id);
    if(user && "liked_tracks" in user && user.liked_tracks.some(e => e.equals(track._id))){
        await Track.findOneAndUpdate({"_id": track._id}, {$inc: {'num_of_likes': -1}})
        let updatedUser = await User.findOneAndUpdate({"_id": user._id}, {$pull: {liked_tracks: track._id }}, {new: true})
        return res.status(httpStatus.OK).json(updatedUser);
    }
    return res.status(httpStatus.BAD_REQUEST).json({error: `You did not like Track ${track.title}`});
}
