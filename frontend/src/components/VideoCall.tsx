// frontend/src/components/VideoCall.tsx

import React, { useEffect, useRef } from 'react';
import { connect, createLocalVideoTrack, Room, RemoteTrackPublication, RemoteVideoTrack, LocalVideoTrack } from 'twilio-video';
import { useStore } from '../store/useStore';

const VideoCall: React.FC = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const { token } = useStore();

  const handleTrackSubscribed = (track: RemoteVideoTrack | LocalVideoTrack) => {
    const trackElement = track.attach();
    videoRef.current?.appendChild(trackElement);
  };

  useEffect(() => {
    if (token) {
      createLocalVideoTrack().then((localTrack) => {
        handleTrackSubscribed(localTrack);

        connect(token, { name: 'room' }).then((room: Room) => {
          room.localParticipant.tracks.forEach((publication) => {
            if (publication.track && publication.track.kind === 'video') {
              handleTrackSubscribed(publication.track as LocalVideoTrack);
            }
          });

          room.on('participantConnected', (participant) => {
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
        });
      });
    }
  }, [token]);

  return <div ref={videoRef} className="h-screen w-full bg-gray-900"></div>;
};

export default VideoCall;
