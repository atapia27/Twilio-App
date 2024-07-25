import React, { useEffect, useRef, useState } from 'react';
import { connect, createLocalVideoTrack, Room, RemoteTrackPublication, RemoteVideoTrack, LocalVideoTrack } from 'twilio-video';
import { useStore } from '../store/useStore';

const VideoCall: React.FC = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const { token } = useStore();
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  const handleTrackSubscribed = (track: RemoteVideoTrack | LocalVideoTrack) => {
    const trackElement = track.attach();
    if (videoRef.current && !videoRef.current.contains(trackElement)) {
      videoRef.current.appendChild(trackElement);
    }
  };

  useEffect(() => {
    if (token && !localTrack) {
      createLocalVideoTrack().then((track) => {
        setLocalTrack(track);
        handleTrackSubscribed(track);

        if (!room) {
          connect(token, { name: 'room' }).then((connectedRoom: Room) => {
            setRoom(connectedRoom);

            connectedRoom.localParticipant.tracks.forEach((publication) => {
              if (publication.track && publication.track.kind === 'video') {
                handleTrackSubscribed(publication.track as LocalVideoTrack);
              }
            });

            connectedRoom.on('participantConnected', (participant) => {
              participant.tracks.forEach((publication: RemoteTrackPublication) => {
                if (publication.isSubscribed && publication.track && publication.track.kind === 'video') {
                  handleTrackSubscribed(publication.track as RemoteVideoTrack);
                }
              });

              participant.on('trackSubscribed', (track) => {
                if (track.kind === 'video') {
                  handleTrackSubscribed(track as RemoteVideoTrack);
                }
              });
            });
          }).catch(error => {
            console.error('Error connecting to Twilio room:', error);
          });
        }
      }).catch(error => {
        console.error('Error creating local video track:', error);
      });
    }

    return () => {
      // Clean up the local video track when the component unmounts
      if (localTrack) {
        localTrack.stop();
        localTrack.detach().forEach(element => element.remove());
      }
      // Disconnect from the room when the component unmounts
      if (room) {
        room.disconnect();
      }
    };
  }, [token, localTrack, room]);

  return <div ref={videoRef} className="h-screen w-full bg-gray-900"></div>;
};

export default VideoCall;