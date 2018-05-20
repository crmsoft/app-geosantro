import { StyleSheet } from 'react-native';
// import Expo from 'expo';
import {
    COLOR_PRIMARY, COLOR_BACKGROUND, COLOR_SECONDARY, COLOR_SURFACE, COLOR_SUCCESS, COLOR_ERROR
} from './colors';
import {
    NAVIGATION_HEIGHT, 
    SPACING,
    TITLE_FONT_SIZE,
    BIG_BTN_HEIGHT,
    SM_BTN_HEIGHT
} from './variables';

const action = {
    flex: 1,
    flexDirection: 'row',
    height: SM_BTN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
}

const statusText = {
    fontSize: 16,
    marginRight: SPACING    
}

export const TranfersStyle = StyleSheet.create({
    wrapper:{
        padding: SPACING,
        height: 115,
        backgroundColor: 'white',
        marginBottom: SPACING
    },
    addDate:{
        fontSize: TITLE_FONT_SIZE
    },
    syncDate:{
        paddingTop: SPACING,
        fontSize: 12
    },
    statusWrapper:{
        padding: SPACING,
    },
    statusContent:{
        flex: 1,
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    statusErrorText:{
        ...statusText,
        color: COLOR_ERROR,        
    },
    statusSuccessText:{
        ...statusText,
        color: COLOR_SUCCESS,        
    },
    statusIcon:{
        marginLeft: -1 * SPACING
    },
    actionsWrapper:{
        flex: 1,
        flexDirection: 'row',
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute'
    },
    actionText:{
        color: 'white'
    },
    actionReorder:{
        ...action,
        backgroundColor: COLOR_PRIMARY
    },
    actionSync:{
        ...action,
        backgroundColor: COLOR_SUCCESS
    },
    actionDelete:{
        ...action,
        backgroundColor: COLOR_ERROR
    },
    /** transfer activity styles */
    actonRemove: {
        backgroundColor: COLOR_ERROR,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING * 2,
    },
    pickerWrapper:{
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'flex-end',
        width: 100,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
    },
    listWrapper: {
        paddingBottom: BIG_BTN_HEIGHT + SPACING,
        flex: 1
    },
    requestTransferWrapper:{
        height: BIG_BTN_HEIGHT,
        backgroundColor: COLOR_PRIMARY,
        flex: 1,
        position: 'absolute',
        bottom: SPACING,
        left: SPACING,
        right: SPACING,
        alignItems: 'center',
        justifyContent: 'center'
    },
    requestTransferText:{
        color: 'white',
        fontSize: 19
    }
});

export const SyncStyle = StyleSheet.create({
    wrapper:{
        height: 125,
        backgroundColor: 'white',
        padding: SPACING,
        marginBottom: SPACING
    },
    title:{
        fontSize: TITLE_FONT_SIZE
    },
    actionWrapper:{
        position: 'absolute',
        padding: SPACING,
        left: 0,
        right: 0,
        bottom: 0,
    },
    actionInner:{
        height: BIG_BTN_HEIGHT,
        backgroundColor: COLOR_PRIMARY
    },
    actionContent:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    actionText:{
        color: 'white',
        fontSize: 16,
        marginRight: SPACING
    },
    actionIcon:{
        marginLeft: SPACING
    },
    hintWrapper:{
        flex: 1
    },
    hintSub:{
        position: 'absolute',
        bottom: 0
    }
});

export const ProductListStyle = StyleSheet.create({
    wrapper: {
        height: 150,
        backgroundColor: 'white',
        marginBottom: SPACING
    },
    item: {
        flex: 1,
        flexDirection: 'row'
    },
    itemTitle:{
        fontSize: TITLE_FONT_SIZE
    },
    image: {
        width: 75,
        height: 75
    },
    infoWrapper: {
        padding: SPACING,
        flex: 1
    },
    itemAction:{ 
        backgroundColor: 'white', 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_PRIMARY,
        padding: SPACING * 2,
    },
    itemActionText:{
        color: 'white',
        fontSize: 16
    }
})

export const NavigationPagerStyle = StyleSheet.create({
    wrapper:{ 
        flex: 1, 
        flexDirection: 'row', 
        position: 'absolute',
        left: 0, 
        right: 0, 
        height: NAVIGATION_HEIGHT,
        paddingTop: SPACING,
        paddingBottom: SPACING 
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: 'white'
    },
    tabText: {
        color: COLOR_SECONDARY,
        fontWeight: 'bold',
        fontSize: 20,
        borderColor: 'green',
        borderBottomColor: 'red',
    },
    tabActive: {
        height: 0,
        borderWidth: 2,
        borderColor: COLOR_PRIMARY
    },
    tabInActive: {
        height: 0,
        borderWidth: 2,
        borderColor:'transparent'
    }
});

export const PagesWrapperStyle = StyleSheet.create({
    wrapper: {
        paddingTop: SPACING
    },
    page: {
      flex: 1,
      paddingTop: NAVIGATION_HEIGHT
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold',
    }
});

export const SearchBarStyles = StyleSheet.create({
    container: {
        // marginTop: Expo.Constants.statusBarHeight,
        backgroundColor: 'white',
        height: NAVIGATION_HEIGHT,
    },
    row: {
        flexDirection: 'row',
    },
    iconWrapper:{
        padding: SPACING,
        paddingTop: SPACING * 2,
    },
    searchInputWrapper:{
        flex: 1,
        padding: SPACING,
    },
    searchInput: {
        height: 45,
        fontSize: 18
    },
    imageIcon:{
        width: 35,
        height: 30
    }
});

export const SplashStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: COLOR_PRIMARY,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        color: '#fff',
        fontSize: 19
    },
    suplier: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 20
    },
    titleWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export const ContainerStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLOR_SURFACE,
        padding: SPACING        
    }
});