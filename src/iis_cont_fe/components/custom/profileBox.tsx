import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import React from 'react';

const CenteredAvatar: React.FC = () => {
    return (
        <div style={styles.container}>
            <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="https://picsum.photos/seed/picsum/200/300" alt="Avatar" />
                <AvatarFallback>JL</AvatarFallback>
            </Avatar>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
        border: '2px solid #3498db'
    },
    avatar: {
        borderRadius: '50%',
        width: '30px',
        height: '30px',
    }
};

export default CenteredAvatar;