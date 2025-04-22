import { docker, getContainerDetails } from '@/services/docker';

const activeLogStreams = new Map();

export function setupSocketHandlers(io: { on: (arg0: string, arg1: (socket: any) => void) => void; }) {
  io.on('connection', (socket) => {
    console.log('Client connected');

    const statsInterval = setInterval(async () => {
      try {
        const containers = await docker.listContainers({ all: true });
        const containerDetails = await Promise.all(
            containers.map(async container => {
              try {
                const details = await getContainerDetails(container.Id);
                if (!details) return null;
                return {
                  id: container.Id,
                  name: container.Names[0].replace('/', ''),
                  state: details.state,
                  stats: details.stats,
                  Created: container.Created,
                  Image: container.Image
                };
              } catch (err) {
                console.error(`Error getting details for container ${container.Id}:`, err);
                return null;
              }
            })
        );
      } catch (err) {
        console.error('Error listing containers:', err);
      }
    }, 5000);


    // Handle log streaming
    socket.on('subscribe-logs', async (containerId: string) => {
      try {
        if (activeLogStreams.has(containerId)) {
          activeLogStreams.get(containerId).destroy();
          activeLogStreams.delete(containerId);
        }

        const container = docker.getContainer(containerId);
        const logStream = await container.logs({
          follow: true,
          stdout: true,
          stderr: true,
          timestamps: true,
          tail: 100
        });

        activeLogStreams.set(containerId, logStream);

        logStream.on('data', (chunk) => {
          socket.emit('container-logs', {
            containerId,
            log: chunk.toString('utf8')
          });
        });

        logStream.on('error', (error) => {
          console.error('Log stream error:', error);
          socket.emit('container-logs-error', {
            containerId,
            error: error.message
          });
        });
      } catch (error) {
        console.error('Error setting up log stream:', error);
        if(error instanceof Error){
          socket.emit('container-logs-error', {
            containerId,
            error: error.message
          });
        }
        else {
          socket.emit('container-logs-error', {
            error: "problem while setting up log stream",
          })
        }

      }
    });

    socket.on('unsubscribe-logs', (containerId: any) => {
      if (activeLogStreams.has(containerId)) {
        activeLogStreams.get(containerId).destroy();
        activeLogStreams.delete(containerId);
      }
    });

    socket.on('disconnect', () => {
      clearInterval(statsInterval);
      // Clean up all active log streams for this socket
      activeLogStreams.forEach(stream => stream.destroy());
      activeLogStreams.clear();
      console.log('Client disconnected');
    });
  });
}
