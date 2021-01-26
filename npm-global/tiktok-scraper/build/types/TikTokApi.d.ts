export interface UserData {
    secUid: string;
    userId: string;
    isSecret: boolean;
    uniqueId: string;
    nickName: string;
    signature: string;
    covers: string[];
    coversMedium: string[];
    following: number;
    fans: number;
    heart: number;
    video: number;
    verified: boolean;
    digg: number;
}
export interface ItemInfos {
    id: string;
    text: string;
    createTime: number;
    authorId: string;
    musicId: string;
    covers: string[];
    coversOrigin: string[];
    coversDynamic: string[];
    video: {
        urls: string[];
        videoMeta: {
            width: number;
            height: number;
            ratio: number;
            duration: number;
        };
    };
    diggCount: number;
    shareCount: number;
    playCount: number;
    commentCount: number;
    isOriginal: boolean;
    isOfficial: boolean;
    isActivityItem: boolean;
    warnInfo: any[];
}
export interface AuthorInfos {
    secUid: string;
    userId: string;
    uniqueId: string;
    nickName: string;
    signature: string;
    verified: boolean;
    covers: string[];
    coversMedium: string[];
    coversLarger: string[];
    isSecret: boolean;
}
export interface MusicInfos {
    musicId: string;
    musicName: string;
    authorName: string;
    original: boolean;
    playUrl: string[];
    covers: string[];
    coversMedium: string[];
    coversLarger: string[];
    posts: number;
}
export interface Challenge {
    challengeId: string;
    challengeName: string;
    isCommerce: boolean;
    text: string;
    covers: string[];
    coversMedium: string[];
    coversLarger: string[];
    posts: number;
    views: string;
    splitTitle: string;
}
export interface AuthorStats {
    followingCount: number;
    followerCount: number;
    heartCount: number;
    videoCount: number;
    diggCount: number;
}
export interface Item {
    itemInfos: ItemInfos;
    authorInfos: AuthorInfos;
    musicInfos: MusicInfos;
    challengeInfoList: Challenge[];
    authorStats: AuthorStats;
}
export interface ItemListData {
    statusCode: number;
    body: {
        itemListData: Item[];
        hasMore: boolean;
        maxCursor: string;
        minCursor: string;
    };
}
export interface ApiResponse<Key extends string, I> {
    statusCode: number;
    body: {
        [key in Key]: I;
    };
}
export interface RequestQuery {
    id: string;
    secUid: string;
    shareUid?: string;
    type?: number;
    sourceType?: number;
    count: number;
    minCursor: number;
    lang: string;
    verifyFp: string;
}
export interface VideoProps {
    props: {
        pageProps: {
            videoData: Item;
        };
    };
}
export interface ItemListDataAPIV2 {
    statusCode: number;
    items: ItemAPIV2[];
    hasMore: boolean;
    maxCursor: string;
    minCursor: string;
}
export interface ItemAPIV2 {
    id: string;
    desc: string;
    createTime: number;
    video: {
        id: string;
        height: number;
        width: number;
        duration: number;
        ratio: string;
        cover: string;
        originCover: string;
        dynamicCover: string;
        playAddr: string;
        downloadAddr: string;
        shareCover: string[];
    };
    author: {
        id: string;
        uniqueId: string;
        nickname: string;
        avatarThumb: string;
        avatarMedium: string;
        avatarLarger: string;
        signature: string;
        verified: boolean;
        secUid: string;
        relation: number;
        openFavorite: boolean;
    };
    music: {
        id: string;
        title: string;
        playUrl: string;
        coverThumb: string;
        coverMedium: string;
        coverLarge: string;
        authorName: string;
        original: boolean;
    };
    challenges: {
        id: string;
        title: string;
        desc: string;
        profileThumb: string;
        profileMedium: string;
        profileLarger: string;
        coverThumb: string;
        coverMedium: string;
        coverLarger: string;
    }[];
    stats: {
        diggCount: number;
        shareCount: number;
        commentCount: number;
        playCount: number;
    };
    originalItem: boolean;
    officalItem: boolean;
    textExtra: {
        awemeId: string;
        start: number;
        end: number;
        hashtagName: string;
        hashtagId: string;
        type: number;
        userId: string;
        isCommerce: boolean;
    }[];
    secret: boolean;
    forFriend: boolean;
    digged: boolean;
    itemCommentStatus: number;
    showNotPass: boolean;
    vl1: boolean;
}
